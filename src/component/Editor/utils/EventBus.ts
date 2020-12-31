import Component from "@egjs/component";
import type { IObject } from "@daybrush/utils";

class EventBus extends Component {
    private eventMap: IObject<number> = {};
    requestTrigger(name: string, params: IObject<any> = {}) {
        const {eventMap} = this;
        cancelAnimationFrame(eventMap[name] || 0);

        eventMap[name] = requestAnimationFrame(() => {
            this.trigger(name, params);
        });
    }
}
export default EventBus;
