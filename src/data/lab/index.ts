import churchArchitecture from '../../content/lab/church/architecture.json';
import churchDecisions from '../../content/lab/church/decisions.json';
import churchModel from '../../content/lab/church/model.json';
import churchTesting from '../../content/lab/church/testing.json';
import portfolioDecisions from '../../content/lab/portfolio-decisions.json';
import schoolfamArchitecture from '../../content/lab/schoolfam/architecture.json';
import schoolfamDecisions from '../../content/lab/schoolfam/decisions.json';
import schoolfamModel from '../../content/lab/schoolfam/model.json';
import schoolfamTesting from '../../content/lab/schoolfam/testing.json';
import studyusiaArchitecture from '../../content/lab/studyusia/architecture.json';
import studyusiaDecisions from '../../content/lab/studyusia/decisions.json';
import studyusiaModel from '../../content/lab/studyusia/model.json';
import studyusiaTesting from '../../content/lab/studyusia/testing.json';
import type { Architecture, Decision, LabProject, Schema, TestSuite } from './types';

/*
 * Lab content is generated or curated JSON in src/content/lab/<project>/.
 * The casts give each file its declared shape; the Lab tests check that every
 * test scenario still matches the data it refers to.
 */
const decisionsOf = (file: unknown) => (file as { decisions: Decision[] }).decisions;
const shared = decisionsOf(portfolioDecisions);

export const labProjects: LabProject[] = [
  {
    id: 'church',
    name: 'Church Management System',
    blurb: 'Final Year Project · PHP, PDO and MySQL',
    architecture: churchArchitecture as Architecture,
    schema: churchModel as Schema,
    testSuite: churchTesting as TestSuite,
    decisions: [...decisionsOf(churchDecisions), ...shared],
  },
  {
    id: 'schoolfam',
    name: 'SchoolFam',
    blurb: 'Team prototype · React, TypeScript and Gemini',
    architecture: schoolfamArchitecture as Architecture,
    schema: schoolfamModel as Schema,
    testSuite: schoolfamTesting as TestSuite,
    decisions: [...decisionsOf(schoolfamDecisions), ...shared],
  },
  {
    id: 'studyusia',
    name: 'StudyUsia',
    blurb: 'Android app · Kotlin, Jetpack Compose and SQLite',
    architecture: studyusiaArchitecture as Architecture,
    schema: studyusiaModel as Schema,
    testSuite: studyusiaTesting as TestSuite,
    decisions: [...decisionsOf(studyusiaDecisions), ...shared],
  },
];
