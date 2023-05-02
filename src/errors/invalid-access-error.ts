import { ApplicationError } from '@/protocols';

export function invalidAccessError(): ApplicationError {
  return {
    name: 'InvalidAccessError',
    message: `You can't complete this action`,
  };
}
