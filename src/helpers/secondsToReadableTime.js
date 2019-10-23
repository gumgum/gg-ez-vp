export default function secondsToReadableTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const readableTime = `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    return readableTime;
}
