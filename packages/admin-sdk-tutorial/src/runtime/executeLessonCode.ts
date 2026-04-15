import type { TutorialSdkBridge } from '@/types/runtime';

export interface LessonExecutionResult {
  ok: boolean;
  message: string;
  error?: string;
}

export function executeLessonCode(
  code: string,
  sdk: TutorialSdkBridge,
): LessonExecutionResult {
  try {
    const runner = new Function('sdk', `'use strict';\n${code}`) as (sdk: TutorialSdkBridge) => void;

    runner(sdk);

    return {
      ok: true,
      message: 'Code executed successfully in the dummy admin runtime.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';

    return {
      ok: false,
      message: 'Code execution failed.',
      error: errorMessage,
    };
  }
}
