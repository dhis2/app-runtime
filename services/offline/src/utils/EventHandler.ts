import { EventHandlerInterface, AnyFunction } from '../types'

export class EventHandler implements EventHandlerInterface {
    private subscriptions = new Map<string, Set<AnyFunction>>()

    public subscribe(event: string, callback: AnyFunction) {
        if (!this.subscriptions.has(event)) {
            this.subscriptions.set(event, new Set())
        }
        this.subscriptions.get(event)?.add(callback)
    }

    public unsubscribe(event: string, callback: AnyFunction) {
        this.subscriptions.get(event)?.delete(callback)
    }

    public trigger(event: string, ...args: any[]) {
        this.subscriptions.get(event)?.forEach(callback => {
            // Wait one tick
            setTimeout(() => {
                callback(...args)
            })
        })
    }
}
