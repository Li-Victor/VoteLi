import Validator from 'validator';

export default (topic, options) => {
  let error = '';

  if (Validator.isEmpty(topic)) error += 'Your poll needs a title! ';

  if (options.length < 2) error += 'You need 2 or more options to make a poll! ';

  const allNoneEmptyOptions = options.every(option => !Validator.isEmpty(option));
  if (!allNoneEmptyOptions) error += 'All options cannot be blank! ';

  return error;
};
