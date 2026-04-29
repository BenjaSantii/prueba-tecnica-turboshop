import { Injectable } from '@nestjs/common'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Provider } from './part.type'

export interface PartChangeEvent {
  sku:          string
  provider:     Provider
  price:        number
  currency:     string
  stock:        number
}

@Injectable()
export class EventsService {

  private readonly subject = new Subject<PartChangeEvent>()

  emit(event: PartChangeEvent): void {
    this.subject.next(event)
  }

  getStream(): Observable<MessageEvent> {
    return this.subject.asObservable().pipe(
      map((event) => ({ data: event }) as MessageEvent)
    )
  }
}
