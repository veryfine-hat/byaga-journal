import {getStore} from './get-store';
import {asyncLocalStorage} from './local-storage';

jest.mock('./local-storage');

it('retrieves the current store from asyncLocalStorage', () => {
    const mockStore = new Map();
    (asyncLocalStorage.getStore as jest.Mock).mockReturnValue(mockStore);

    const store = getStore();

    expect(store).toBe(mockStore);
    expect(asyncLocalStorage.getStore).toHaveBeenCalled();
});