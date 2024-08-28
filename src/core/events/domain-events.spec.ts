import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()

    // Cadastro do subscribe
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Criando a resposta (Sem salvar no banco)
    const aggregate = CustomAggregate.create()

    // Espera que o enevto foi criado, mas não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Sando no banco e disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // subscribe ouve o evento e trata o dado
    expect(callbackSpy).toHaveBeenCalled()

    // Espera que a lista de evento esteja vazia
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
