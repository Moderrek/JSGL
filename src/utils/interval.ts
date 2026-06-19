
/**
 * Executes callback every delay milliseconds for count times.
 * @param callback - Function to execute
 * @param delay - Delay in milliseconds between executions
 * @param count - Number of times to execute callback
 * @example
 * DelayedFor(() => console.log('Hello'), 1000, 5); // Logs 'Hello' every second, 5 times
 */
export function DelayedFor(callback: () => void, delay: number, count: number) {
    let i = 0;
    const taskId = setInterval(() => {
        if (++i === count)
            clearInterval(taskId);
        callback();
    }, delay);
}