import { h } from 'preact';
import { shallow } from 'enzyme';

import Button from 'components/shared/button';
import TextInput from 'components/shared/text_input';

import { Join } from 'components/join';

describe('<Join />', () => {
  describe('join button', () => {
    it('is disabled when the name field is empty', () => {
      const wrapper = shallow(<Join />);
      const gameIdField = wrapper.find(TextInput).filter({ name: 'game-id' });

      gameIdField.props().onChange('A6');

      expect(
        wrapper.find(Button).filter({ name: 'join' }).props().disabled
      ).toBe(true);
    });

    it('is disabled when the game ID field is empty', () => {
      const wrapper = shallow(<Join />);
      const nameField = wrapper.find(TextInput).filter({ name: 'name' });

      nameField.props().onChange('andrew');

      expect(
        wrapper.find(Button).filter({ name: 'join' }).props().disabled
      ).toBe(true);
    });

    it('is enabled when the name and game ID field are populated', () => {
      const wrapper = shallow(<Join />);
      const nameField = wrapper.find(TextInput).filter({ name: 'name' });
      const gameIdField = wrapper.find(TextInput).filter({ name: 'game-id' });

      nameField.props().onChange('andrew');
      gameIdField.props().onChange('A6');

      expect(
        wrapper.find(Button).filter({ name: 'join' }).props().disabled
      ).toBe(false);
    });

    it('calls the joinGame function', () => {
      const joinGame = jest.fn().mockResolvedValue();

      const wrapper = shallow(<Join joinGame={joinGame} />);

      const nameField = wrapper.find(TextInput).filter({ name: 'name' });
      const gameIdField = wrapper.find(TextInput).filter({ name: 'game-id' });

      nameField.props().onChange('The Grund');
      gameIdField.props().onChange('A5');

      wrapper.find(Button).filter({ name: 'join' }).props().onClick();

      expect(joinGame).toHaveBeenCalledTimes(1);
      expect(joinGame.mock.calls[0][0]).toEqual({
        name: 'The Grund',
        gameId: 'A5'
      });
    });
  });

  xit('displays an error state when joining a game fails', async () => {
    const joinGame = jest.fn().mockRejectedValue();

    const wrapper = shallow(<Join joinGame={joinGame} />);

    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().error
    ).toBe(false);
    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().helperText
    ).toBe('');

    await wrapper.find(Button).props().onClick();

    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().error
    ).toBe(true);
    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().helperText
    ).toBe('Invalid Game ID');
  });

  xit('clears the error state when the game ID field changes', async () => {
    const joinGame = jest.fn().mockRejectedValue();

    const wrapper = shallow(<Join joinGame={joinGame} />);

    await wrapper.find(Button).props().onClick();

    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().error
    ).toBe(true);

    wrapper
      .find(TextInput)
      .filter({ name: 'game-id' })
      .props()
      .onInput({ target: { value: 'A6' } });

    expect(
      wrapper.find(TextInput).filter({ name: 'game-id' }).props().error
    ).toBe(false);
  });
});
