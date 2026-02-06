import {type SpeedUnit} from './types.js';

export const convertToMbps = (value: number, unit: SpeedUnit): number => {
	if (!value) {
		return 0;
	}

	switch (unit) {
		case 'Gbps': {
			return value * 1000;
		}

		case 'Mbps': {
			return value;
		}

		case 'Kbps': {
			return value / 1000;
		}

		case 'Bps': {
			return value / 1_000_000;
		}
	}
};

export const formatMegabytes = (megabytes: number): string => {
	if (megabytes === 0) {
		return '0 MB';
	}

	if (megabytes >= 1024) {
		return `${(megabytes / 1024).toFixed(2)} GB`;
	}

	if (megabytes < 1) {
		return `${(megabytes * 1024).toFixed(0)} KB`;
	}

	return `${megabytes.toFixed(2)} MB`;
};
