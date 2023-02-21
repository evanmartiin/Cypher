import DanceStep from '@scripts/Timeline/steps/DanceStep.js';
import DemoStep from '@scripts/Timeline/steps/DemoStep.js';
import NextPlayerStep from '@scripts/Timeline/steps/NextPlayerStep.js';
import PlayerDetectedStep from '@scripts/Timeline/steps/PlayerDetectedStep.js';
import PositionValidatedStep from '@scripts/Timeline/steps/PositionValidatedStep.js';
import StartPositionStep from '@scripts/Timeline/steps/StartPositionStep.js';
import TimerStep from '@scripts/Timeline/steps/TimerStep.js';
import TrainingStep from '@scripts/Timeline/steps/TrainingStep.js';
import WaitingStep from '@scripts/Timeline/steps/WaitingStep.js';
import WellDoneStep from '@scripts/Timeline/steps/WellDoneStep.js';

let i = 0;

const EVENTS = {
	LOADER_PROGRESS: i++,

	ATTACH: i++,
	RESIZE: i++,

	TICK: i++,
	RENDER: i++,

	MOUSE_MOVE: i++,
	POINTER_UP: i++,
	POINTER_DOWN: i++,

	KEY_DOWN: i++,
};

const EVENTS_MAP = Object.fromEntries(
	Object.entries(EVENTS).map(([key, value]) => [
		value,
		`on${key
			.toLowerCase()
			.split('_')
			.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
			.join('')}`,
	]),
);

const STEPS = [WaitingStep, PlayerDetectedStep, TrainingStep, DemoStep, StartPositionStep, PositionValidatedStep, TimerStep, DanceStep, WellDoneStep, NextPlayerStep];

export { EVENTS, EVENTS_MAP, STEPS };
