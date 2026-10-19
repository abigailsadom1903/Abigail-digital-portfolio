import architectureData from '../../content/lab/architecture.json';
import decisionsData from '../../content/lab/decisions.json';
import schemaData from '../../content/lab/schema.json';
import testingData from '../../content/lab/testing.json';
import type { Architecture, Decision, Schema, TestSuite } from './types';

// Lab content is generated or curated JSON (see src/content/lab/); the casts give it its declared shape.
export const architecture = architectureData as Architecture;
export const schema = schemaData as Schema;
export const testSuite = testingData as TestSuite;
export const decisions = (decisionsData as { decisions: Decision[] }).decisions;
