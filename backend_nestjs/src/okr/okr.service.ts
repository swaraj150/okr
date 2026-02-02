import { Injectable, NotFoundException } from '@nestjs/common';
import { Okr } from './okr.type';
import { CreateOkrDto, UpdateOkrDto } from './createOkrDto';

@Injectable()
export class OkrService {
  private okrList: Okr[] = [];

  fetchAll(): Okr[] {
    return this.okrList;
  }

  create(okrReq: CreateOkrDto): Okr[] {
    const newOkr: Okr = {
      id: crypto.randomUUID(),
      objective: okrReq.objective,
      keyResults: okrReq.keyResults.map((keyResult) => ({
        ...keyResult,
        id: crypto.randomUUID(),
      })),
    };
    this.okrList = [...this.okrList, newOkr];
    return this.okrList;
  }

  edit(okrReq: UpdateOkrDto): Okr[] {
    if (!okrReq.id) {
      throw new NotFoundException();
    }
    const updatedOkr: Okr = {
      id: okrReq.id,
      objective: okrReq.objective,
      keyResults: okrReq.keyResults.map((keyResult) => ({
        id: !keyResult.id ? crypto.randomUUID() : keyResult.id,
        description: keyResult.description,
        progress: keyResult.progress,
      })),
    };
    this.okrList = this.okrList.map((okr) => {
      if (okr.id == updatedOkr.id) {
        return updatedOkr;
      }
      return okr;
    });
    return this.okrList;
  }

  delete(id: string) {
    if (!id) {
      return;
    }
    this.okrList = this.okrList.filter((okr) => okr.id !== id);
  }
}
