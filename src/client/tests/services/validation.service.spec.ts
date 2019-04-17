import { required, validateEmail, validatePassword } from '../../services';

describe('Validation service', () =>
{
    it('should return required', () =>
    {
        expect(required(undefined)).toEqual("Required");
    });

    it('should validate email', () =>
    {
        expect(validateEmail(undefined)).toEqual("Invalid Email");
    });

    it('should validate password', () =>
    {
        expect(validatePassword("")).toEqual("Must be at least 10 characters");
    });
})