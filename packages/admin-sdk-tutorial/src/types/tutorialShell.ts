export interface TutorialRunSnapshot {
  lessonId: string;
  code: string;
  runCode: string;
  runVersion: number;
  runtimeLocationId: string;
}

export interface TutorialSetRunSnapshotMessage {
  source: 'tutorial-parent';
  type: 'tutorial:set-run-snapshot';
  payload: TutorialRunSnapshot;
}

export interface TutorialShellRunSuccessMessage {
  source: 'tutorial-shell';
  type: 'run-success';
  payload: {
    lessonId: string;
    runVersion: number;
  };
}

export interface TutorialShellRunErrorMessage {
  source: 'tutorial-shell';
  type: 'run-error';
  payload: {
    lessonId: string;
    runVersion: number;
    error: string;
  };
}

export type TutorialShellMessage = TutorialShellRunSuccessMessage | TutorialShellRunErrorMessage;

function safeParseJson(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export function parseTutorialParentMessage(value: unknown): TutorialSetRunSnapshotMessage | null {
  const parsed = safeParseJson(value);

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  const message = parsed as Partial<TutorialSetRunSnapshotMessage>;

  return message.source === 'tutorial-parent' && message.type === 'tutorial:set-run-snapshot'
    ? (message as TutorialSetRunSnapshotMessage)
    : null;
}

export function parseTutorialShellMessage(value: unknown): TutorialShellMessage | null {
  const parsed = safeParseJson(value);

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  const message = parsed as Partial<TutorialShellMessage>;

  if (message.source !== 'tutorial-shell') {
    return null;
  }

  if (message.type === 'run-success' || message.type === 'run-error') {
    return message as TutorialShellMessage;
  }

  return null;
}
