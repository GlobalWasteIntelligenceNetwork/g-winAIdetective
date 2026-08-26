import type { AnalysisInput, DetectiveReport, EnvironmentType } from '@/types';

const ENVIRONMENT_PROFILES: Record<
  EnvironmentType,
  { observed: string[]; pattern: string; investigateNext: string }
> = {
  Park: {
    observed: ['Cigarette butts', 'Food packaging', 'Paper waste'],
    pattern:
      'Possible localized litter accumulation. This may indicate that waste is concentrating near entry points or seating areas, which could suggest insufficient disposal infrastructure or peak-usage overflow.',
    investigateNext:
      'Collect additional observations from the same location at different times of day and compare results to identify when accumulation peaks.',
  },
  Street: {
    observed: ['Cigarette butts', 'Food packaging', 'Plastic wrappers'],
    pattern:
      'Possible corridor accumulation along foot-traffic routes. This could suggest that waste is being deposited at predictable points, which may indicate a lack of convenient disposal options along the route.',
    investigateNext:
      'Map the exact positions of observed waste along the street and compare against the locations of public bins.',
  },
  School: {
    observed: ['Food packaging', 'Drink containers', 'Snack wrappers'],
    pattern:
      'Possible concentration of consumption-related waste. This may indicate that waste generation is tied to break times or meal service, which could suggest a need for structured disposal during those periods.',
    investigateNext:
      'Observe the same area before and after lunch periods across several days and note whether the waste type changes.',
  },
  Beach: {
    observed: ['Plastic packaging', 'Plastic bottles', 'Fishing-related debris'],
    pattern:
      'Possible concentration of single-use plastic waste. This could suggest a mix of visitor-deposited litter and shoreline deposition, which may indicate both local behavior and upstream sources.',
    investigateNext:
      'Record observations at the same beach across different tidal conditions and weather to separate visitor litter from deposited debris.',
  },
  'River / waterway': {
    observed: ['Plastic bottles', 'Plastic packaging', 'Organic debris mixed with waste'],
    pattern:
      'Possible accumulation of floating or shoreline waste. This may indicate that the waterway is acting as a transport corridor, which could suggest upstream waste sources rather than local littering alone.',
    investigateNext:
      'Trace observations upstream of the accumulation point and compare waste composition to distinguish local from transported waste.',
  },
  'Residential area': {
    observed: ['Household packaging', 'Food waste', 'Discarded bulky items'],
    pattern:
      'Possible concentration of household-related waste. This could suggest inconsistent collection service or informal dumping, which may indicate a gap in scheduled waste pickup or community disposal habits.',
    investigateNext:
      'Cross-reference observation dates with the local collection schedule and note whether accumulation aligns with missed pickup days.',
  },
  Other: {
    observed: ['Mixed packaging', 'Unidentified waste items'],
    pattern:
      'Possible mixed waste accumulation. This could suggest a combination of sources, which may indicate that further categorization is needed before a clear pattern can be proposed.',
    investigateNext:
      'Categorize each observed item by material type and re-observe the location to determine whether the mix is stable or shifting.',
  },
};

function derivePriority(input: AnalysisInput): DetectiveReport['priority'] {
  if (input.environment === 'Beach' || input.environment === 'River / waterway') return 'HIGH';
  if (input.environment === 'Street' || input.environment === 'Residential area') return 'MEDIUM';
  return 'LOW';
}

function deriveConfidence(input: AnalysisInput): DetectiveReport['confidence'] {
  if (input.city.trim().length === 0) return 'LOW';
  if (input.environment === 'Other' || input.country === 'Other') return 'MEDIUM';
  return 'MEDIUM';
}

export function analyzeObservation(input: AnalysisInput): DetectiveReport {
  const profile = ENVIRONMENT_PROFILES[input.environment] ?? ENVIRONMENT_PROFILES.Other;
  return {
    observed: profile.observed,
    possiblePattern: profile.pattern,
    priority: derivePriority(input),
    confidence: deriveConfidence(input),
    investigateNext: profile.investigateNext,
    isDemo: true,
  };
}

export const DEMO_DISCLAIMER =
  'This is a DEMONSTRATION analysis generated from sample logic, not a real AI vision model. These results are not real observations and must not be treated as environmental findings.';
