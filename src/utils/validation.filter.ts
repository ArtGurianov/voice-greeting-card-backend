import {Catch, HttpException} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {CustomError, CustomResult} from './CustomResult';

@Catch(HttpException)
class ValidationFilter implements GqlExceptionFilter {
  catch(err: any) {
    if (err.response.origin === 'ValidationPipe') {
      const resultArray: CustomError[] = [];
      err.response?.response?.message?.map((valErrObj: any) => {
        const messages: string[] = [];
        Object.keys(valErrObj.constraints).forEach(key => {
          messages.push(valErrObj.constraints[key]);
        });
        resultArray.push(
          new CustomError({
            location: valErrObj.property,
            errorMessages: messages,
          }),
        );
      });

      return new CustomResult({errors: resultArray});
    }
    return err;
  }
}

const validationFilter = new ValidationFilter();
export default validationFilter;
