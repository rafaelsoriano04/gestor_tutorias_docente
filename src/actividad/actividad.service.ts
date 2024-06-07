import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from 'src/entities/actividad.entity';
import { ActividadDto } from 'src/dtos/actividad.dto';
import { Informe } from 'src/entities/informe.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,

    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
  ) {}

  async findById(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { id } });
    if (!actividad) {
      throw new NotFoundException(`Actividad with ID ${id} not found`);
    }
    return actividad;
  }

  async findByInformeId(informeId: number): Promise<Actividad[]> {
    return this.actividadRepository.find({
      where: { informe: { id: informeId } },
    });
  }

  //CREAR LA ACTIVIDAD PRIMERO COMPROBANDO LA ID DEL INFORME AL QUE PERTENECE
  async createActividad(ActividadDto: ActividadDto): Promise<Actividad> {
    const informe = await this.informeRepository.findOne({
      where: { id: ActividadDto.id_informe },
    });
    if (!informe) {
      throw new NotFoundException(`Id de informe incorrecta`);
    }

    const actividad = this.actividadRepository.create({
      ...ActividadDto,
      informe,
    });

    return this.actividadRepository.save(actividad);
  }
}
