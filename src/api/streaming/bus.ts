import EventEmitter from "events";
import { Event } from "./events";

class EventBus {
    private localTimelineEventEmitter = new EventEmitter();

    public subscribe(listener: (event: Event) => void) {
        this.localTimelineEventEmitter.on('event', listener);
        return () => {
            this.localTimelineEventEmitter.off('event', listener);
        }
    }

    public publish(event: Event) {
        this.localTimelineEventEmitter.emit('event', event);
    }
}

export const localTimelineEventBus = new EventBus();
