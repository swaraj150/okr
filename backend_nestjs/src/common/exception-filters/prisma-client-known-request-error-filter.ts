import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';

export class PrismaClientKnownRequestErrorFilter extends BaseExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch (exception.code) {
            case 'P2006': {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    message: exception.message,
                });
            }
            case 'P2025': {
                const entity = this.extractEntityName(exception);
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: `${entity} not found`,
                });
            }
            case 'P2034': {
                return response.status(HttpStatus.CONFLICT).json({
                    message: exception.message,
                });
            }
        }

        super.catch(exception, host);
    }

    private extractEntityName(
        exception: PrismaClientKnownRequestError,
    ): string {
        const modelName = exception.meta?.modelName || exception.meta?.cause;

        if (typeof modelName === 'string') {
            return modelName;
        }

        return 'Record';
    }
}
