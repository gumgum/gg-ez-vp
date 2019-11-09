import { JAVASCRIPT_MIME_TYPES } from '../constants';
export default function mediaFilesReducer(mediaFiles = []) {
    return mediaFiles.reduce(
        (acc, mediaFile) => {
            const isJavaScript = JAVASCRIPT_MIME_TYPES.includes(mediaFile.mimeType);
            const isAudio = mediaFile.mimeType.includes('audio/');
            const isVideo = mediaFile.mimeType.includes('video/');
            const isStream = mediaFile.mimeType === 'application/x-mpegURL';
            const isMedia = isAudio || isVideo || isStream;
            const container = isJavaScript ? 'javascript' : isMedia ? 'media' : 'other';
            acc[container].push(mediaFile);
            return acc;
        },
        { javascript: [], media: [], other: [] }
    );
}
