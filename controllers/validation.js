import HttpStatus from 'http-status';

export const validatingErrors = (err) => {
  let errors = {};
  console.log('***********ERORR*****************')
  console.log(err)
  if (err) {
    if (err.name !== 'MongoServerError') {
      for (let field in err.errors) {
        switch (err.errors[field].kind) {
          case 'required':
            errors[field] = [field] + ' is Required';
            break;
          case 'unique':
            errors[field] = 'Already Exist';
            break;
          case 'enum':
            errors[field] = 'Invalid ' + [field];
            break;
          case 'Number':
            errors[field] = [field] + ' must be a Number';
            break;
          case 'Date':
            errors[field] = [field] + ' must be a Valid Date';
            break;
          case 'regexp':
            errors[field] = [field] + ' is invalid';
            break;
          case 'ObjectId':
            errors[field] = [field] + ' is NotValid';
        }
      }
    } else {
      switch (err.code) {
        case 11000:
          const field = Object.keys(err.keyPattern)[0]
          errors[field] = [field] + ' Already Exist';
          break;
      }
    }
  }
  return errors;
};

export const errorHandling = (err, res) => {

  switch (err.name) {
    case 'ValidationError':
      res.status(HttpStatus.BAD_REQUEST).json(validatingErrors(err))
      break;
    case 'ReferenceError':
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
      break;
    case 'MongoServerError':
      res.status(HttpStatus.BAD_REQUEST).json(validatingErrors(err));
      break
    default:
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
  }
};