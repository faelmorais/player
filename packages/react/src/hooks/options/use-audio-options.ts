import { useReactContext, useSignal } from 'maverick.js/react';
import * as React from 'react';
import { mediaContext, type AudioTrack } from 'vidstack/lib';

export function useAudioOptions(): AudioOptions {
  const media = useReactContext(mediaContext)!,
    { audioTracks, audioTrack } = media.$state,
    $audioTracks = useSignal(audioTracks);

  useSignal(audioTrack);

  return React.useMemo(() => {
    const options = $audioTracks.map<AudioOption>((track) => ({
      track,
      label: track.label,
      value: getTrackValue(track),
      get selected() {
        return audioTrack() === track;
      },
      select(trigger) {
        const index = audioTracks().indexOf(track);
        if (index >= 0) media.remote.changeAudioTrack(index, trigger);
      },
    }));

    Object.defineProperty(options, 'selectedTrack', {
      get() {
        return audioTrack();
      },
    });

    Object.defineProperty(options, 'selectedValue', {
      get() {
        const track = audioTrack();
        return track ? getTrackValue(track) : undefined;
      },
    });

    return options as AudioOptions;
  }, [$audioTracks]);
}

export type AudioOptions = AudioOption[] & {
  readonly selectedTrack: AudioTrack | null;
  readonly selectedValue: string | undefined;
};

export interface AudioOption {
  readonly track: AudioTrack;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  select(trigger?: Event): void;
}

function getTrackValue(track: AudioTrack) {
  return track.label.toLowerCase();
}
