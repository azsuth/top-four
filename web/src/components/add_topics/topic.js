import { h } from 'preact';

import IconDelete from 'components/shared/icon/icon_delete';

import { withAction } from '@state';
import { deleteTopic } from '@actions';

const Topic = ({ topic: topicObj, deleteTopic }) => {
  const { uid, topic } = topicObj;

  return (
    <div class="topic flex justify--between align-items--center">
      <span>{topic}</span>
      <div onClick={() => deleteTopic(uid)}>
        <IconDelete color="secondary" />
      </div>
    </div>
  );
};

const withDeleteTopicAction = withAction(deleteTopic, 'deleteTopic');

export { Topic };
export default withDeleteTopicAction(Topic);
