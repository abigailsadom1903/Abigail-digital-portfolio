import { describe, expect, it } from 'vitest';
import { labProjects } from './index';
import { canSee, enumValues, registrationAllowed, roomAvailable, runScenario, uniqueColumnSets } from './testEngine';
import type { TestScenario } from './types';

const church = labProjects.find((p) => p.id === 'church')!;
const schoolfam = labProjects.find((p) => p.id === 'schoolfam')!;
const ctxOf = (p: typeof church) => ({ schema: p.schema, navigation: p.testSuite.navigation });

describe('testEngine helpers', () => {
  it('parses allowed values from SQL ENUMs and TypeScript unions', () => {
    expect(enumValues("ENUM('pending','approved','rejected')")).toEqual(['pending', 'approved', 'rejected']);
    expect(enumValues("'paid' | 'pending'")).toEqual(['paid', 'pending']);
    expect(enumValues("PickupStatus ('pending' | 'bus')")).toEqual(['pending', 'bus']);
    expect(enumValues('VARCHAR(30)')).toEqual([]);
    expect(enumValues("string // e.g. 'x'")).toEqual([]);
  });

  it('collects composite and column-level unique keys', () => {
    const slots = church.schema.tables.find((t) => t.name === 'confession_slots')!;
    expect(uniqueColumnSets(slots)).toContainEqual(['church_id', 'slot_date', 'slot_time']);
    const admin = church.schema.tables.find((t) => t.name === 'admin')!;
    expect(uniqueColumnSets(admin)).toContainEqual(['admin_email']);
  });

  it('applies role-based navigation, including "all"', () => {
    const nav = schoolfam.testSuite.navigation!;
    expect(canSee(nav, 'PARENT', 'messages')).toBe(true);
    expect(canSee(nav, 'ADMIN', 'moments')).toBe(false);
    expect(() => canSee(nav, 'PARENT', 'nope')).toThrow(/Unknown navigation item/);
  });

  it("models SchoolFam's sign-up rules", () => {
    const fixtures = {
      teacherIds: ['T2'],
      referralCodes: [{ code: 'INV-1', status: 'active' as const, forRole: 'TEACHER' }],
      accessCodes: ['STU-1'],
    };
    expect(registrationAllowed('TEACHER', ' t2 ', fixtures)).toBe(true);
    expect(registrationAllowed('TEACHER', 'INV-1', fixtures)).toBe(true);
    expect(registrationAllowed('TEACHER', 'inv-1', fixtures)).toBe(false); // invite codes are case-sensitive
    expect(registrationAllowed('PARENT', 'STU-1', fixtures)).toBe(true);
    expect(registrationAllowed('PARENT', 'INV-1', fixtures)).toBe(false);
    expect(registrationAllowed('PARENT', '', fixtures)).toBe(false);
  });

  it("models StudyUsia's room availability check", () => {
    const fixtures = {
      room: { startDate: '2026-01-01', endDate: '2026-12-31', openTime: '08:00', closeTime: '22:00' },
      bookings: [
        { date: '2026-11-10', startTime: '10:00', endTime: '12:00', status: 'confirmed' },
        { date: '2026-11-10', startTime: '15:00', endTime: '17:00', status: 'cancelled' },
      ],
    };
    const at = (date: string, startTime: string, endTime: string) => roomAvailable({ date, startTime, endTime }, fixtures);
    expect(at('2026-11-10', '13:00', '14:00')).toBe(true);
    expect(at('2026-11-10', '09:00', '13:00')).toBe(false); // covers the booking
    expect(at('2026-11-10', '08:00', '10:00')).toBe(false); // touching slots clash
    expect(at('2026-11-10', '15:00', '17:00')).toBe(true); // only confirmed bookings count
    expect(at('2026-11-10', '21:00', '22:30')).toBe(false); // after closing
    expect(at('2025-12-31', '10:00', '12:00')).toBe(false); // before the available period
    const singleDay = { ...fixtures, room: { ...fixtures.room, endDate: '' } };
    expect(roomAvailable({ date: '2026-01-01', startTime: '13:00', endTime: '14:00' }, singleDay)).toBe(true);
    expect(roomAvailable({ date: '2026-01-02', startTime: '13:00', endTime: '14:00' }, singleDay)).toBe(false);
  });
});

describe.each(labProjects.map((p) => [p.name, p] as const))('%s scenarios', (_, project) => {
  it.each(project.testSuite.scenarios.map((s) => [s.id, s] as const))('%s passes against the real rules', (_, scenario) => {
    expect(runScenario(ctxOf(project), scenario).status).toBe('passed');
  });

  it('has unique scenario ids', () => {
    const ids = project.testSuite.scenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('catches the simulated regression, while "allowed" scenarios keep passing', () => {
    const results = project.testSuite.scenarios.map((s) => runScenario(ctxOf(project), s, { regression: true }));
    expect(results.some((r) => r.status === 'failed')).toBe(true);
    project.testSuite.scenarios.forEach((s, i) => {
      if (s.expect === 'accepted' || s.expect === 'visible') expect(results[i].status).toBe('passed');
    });
  });
});

describe('runScenario', () => {
  it('reports expected and actual outcomes in plain language', () => {
    const scenario: TestScenario = {
      id: 'X',
      title: 'x',
      area: 'x',
      type: 'x',
      steps: [],
      rule: { kind: 'enum', table: 'donations', column: 'status', value: 'refunded' },
      expect: 'accepted',
    };
    const result = runScenario(ctxOf(church), scenario);
    expect(result.status).toBe('failed');
    expect(result.actual.text).toMatch(/rejected/);
    expect(result.expected.text).toMatch(/accepted/);
  });

  it('throws for scenarios that reference unknown tables', () => {
    const scenario = {
      ...church.testSuite.scenarios[0],
      rule: { kind: 'enum', table: 'nope', column: 'x', value: 'y' },
    } as TestScenario;
    expect(() => runScenario(ctxOf(church), scenario)).toThrow(/Unknown table/);
  });
});
