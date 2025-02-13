import {dirname, normalize} from 'path';

import {DocPreset, YfmPreset} from '../models';

export type PresetStorage = Map<string, YfmPreset>;

let presetStorage: PresetStorage = new Map();

function add(parsedPreset: DocPreset, path: string, varsPreset: string) {
    const combinedValues: YfmPreset = {
        ...(parsedPreset.default || {}),
        ...(parsedPreset[varsPreset] || {}),
    };

    const key = dirname(normalize(path));
    presetStorage.set(key, combinedValues);
}

function get(path: string): YfmPreset {
    let combinedValues: YfmPreset = {};
    let localPath = normalize(path);

    while (localPath !== '.') {
        const presetValues: YfmPreset = presetStorage.get(localPath) || {};
        localPath = dirname(localPath);

        combinedValues = {
            ...presetValues,
            ...combinedValues,
        };
    }

    // Add root' presets
    combinedValues = {
        ...presetStorage.get('.'),
        ...combinedValues,
    };

    return combinedValues;
}

function getPresetStorage(): Map<string, YfmPreset> {
    return presetStorage;
}

function setPresetStorage(preset: Map<string, YfmPreset>): void {
    presetStorage = preset;
}

export default {
    add,
    get,
    getPresetStorage,
    setPresetStorage,
};
