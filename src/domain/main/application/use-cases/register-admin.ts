import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { AdminAlreadyExistError } from './errors/admin-already-exist-error'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
  latitude: number
  longitude: number
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistError,
  {
    admin: Deliveryman
  }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    latitude,
    longitude,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminRepository.findByCPF(cpf)

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExistError(cpf))
    }

    const adminPassword = 'admin123'

    if (adminPassword !== password) {
      return left(new Error('Unauthorized'))
    }

    const cpfText = Cpf.createFromText(cpf)
    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Deliveryman.create({
      cpf: cpfText,
      name,
      password: hashedPassword,
      latitude,
      longitude,
      role: 'ADMIN',
    })

    await this.adminRepository.create(admin)

    return right({
      admin,
    })
  }
}
