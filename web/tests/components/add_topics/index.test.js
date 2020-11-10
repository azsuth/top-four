import { h } from 'preact';
import { shallow } from 'enzyme';

import Button from 'components/shared/button';
import TextInput from 'components/shared/text_input';

import { AddTopics } from 'components/add_topics';
import Topic from 'components/add_topics/topic';

describe('<AddTopics />', () => {
  describe('add button', () => {
    it('is disabled when the topic field is empty', () => {
      const wrapper = shallow(<AddTopics playerTopics={[]} routes={[]} />);

      wrapper.find(TextInput).props().onChange('');

      expect(
        wrapper.find(Button).filter({ name: 'add' }).props().disabled
      ).toBe(true);
    });

    it('is enabled when the topic field is populated', () => {
      const wrapper = shallow(<AddTopics playerTopics={[]} routes={[]} />);

      wrapper.find(TextInput).props().onChange('socks with sandals');

      expect(
        wrapper.find(Button).filter({ name: 'add' }).props().disabled
      ).toBe(false);
    });

    it('clears the input when clicked', () => {
      const wrapper = shallow(
        <AddTopics
          playerTopics={[]}
          addTopic={jest.fn().mockResolvedValue()}
          routes={[]}
        />
      );

      wrapper.find(TextInput).props().onChange('road trips');

      wrapper.find(Button).filter({ name: 'add' }).props().onClick();

      expect(wrapper.find(TextInput).props().value).toBe('');
    });

    it('calls the addTopic function when clicked', () => {
      const addTopic = jest.fn().mockResolvedValue();

      const wrapper = shallow(
        <AddTopics playerTopics={[]} addTopic={addTopic} routes={[]} />
      );

      wrapper.find(TextInput).props().onChange('sex on the beach');

      wrapper.find(Button).filter({ name: 'add' }).props().onClick();

      expect(addTopic).toHaveBeenCalledTimes(1);
      expect(addTopic.mock.calls[0][0]).toBe('sex on the beach');
    });
  });

  it('renders player topics', () => {
    const playerTopics = [
      { uid: '12345', topic: 'road trips' },
      { uid: '23456', topic: 'johnny depp' }
    ];

    const wrapper = shallow(
      <AddTopics playerTopics={playerTopics} routes={[]} />
    );

    expect(wrapper.find(Topic)).toHaveLength(2);
  });
});
