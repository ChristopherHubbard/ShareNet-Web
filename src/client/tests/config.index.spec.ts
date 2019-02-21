process.env.ENV = "LOCAL";
import Config from '../config';

describe('Config import', () =>
{
    it('should return env config when specified', () =>
    {
        expect(Config.apiUrl).toBeTruthy;
    });
});