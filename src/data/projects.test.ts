import { describe, expect, it } from 'vitest';
import { toProject } from './projects';

describe('toProject', () => {
  it('turns an uploaded report into a link under the site base path', () => {
    const p = toProject({ title: 'StudyUsia', report: '/reports/studyusia-report.pdf' }, 0);
    expect(p.report?.href).toBe(`${import.meta.env.BASE_URL}reports/studyusia-report.pdf`);
    expect(p.report?.label).toBe('Read the report');
  });

  it('uses a custom button label when given', () => {
    const p = toProject({ title: 'X', report: '/reports/x.pdf', reportLabel: 'Final Year Project report' }, 0);
    expect(p.report?.label).toBe('Final Year Project report');
  });

  it('has no report when none is uploaded', () => {
    expect(toProject({ title: 'X' }, 0).report).toBeNull();
    expect(toProject({ title: 'X', report: '  ' }, 0).report).toBeNull();
  });
});
