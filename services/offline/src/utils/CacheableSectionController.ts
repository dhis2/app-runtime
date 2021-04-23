import {
    CacheableSectionOptions,
    OfflineConfig,
    CacheableSectionControllerInterface,
    CacheableSectionState,
    CacheableSectionStateUpdate,
} from '../types'
import { EventHandler } from './EventHandler'

// Internal, wrapped by CacheableSection
export class CacheableSectionController
    extends EventHandler
    implements CacheableSectionControllerInterface {
    private id: string
    private options: OfflineConfig

    private state: CacheableSectionState = {
        recordingPending: false,
        recording: false,
        updating: false,
        lastUpdated: undefined,
    }

    constructor(config: OfflineConfig, { id }: CacheableSectionOptions) {
        super()
        this.options = config
        this.id = id
    }

    async queueRecording() {
        // Send start recording message to ServiceWorker
        this.setState({ recordingPending: true })
    }

    async startRecording() {
        this.setState({ recordingPending: false })
        await this.options.cache.startRecording(this.id)
        this.setState({ recording: true })
    }

    async stopRecording() {
        // Send stop recording message to ServiceWorker
        this.setState({ recordingPending: false })
        if (this.state.recording) {
            await this.options.cache.stopRecording(this.id)
            this.setState({ recording: false, lastUpdated: new Date() })
        }
    }

    async update() {
        this.setState({ updating: true })
        await this.options.cache.update(this.id)
        this.setState({
            updating: false,
            lastUpdated: new Date(),
        })
    }

    private setState(stateUpdate: CacheableSectionStateUpdate) {
        this.state = {
            ...this.state,
            ...stateUpdate,
        }
        this.trigger('stateChanged', this.getState())
    }
    public getState() {
        return Object.freeze({
            ...this.state,
        })
    }
}
