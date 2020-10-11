import { h } from 'preact';

import IconDelete from 'components/shared/icon/icon_delete';

import { withAction } from '@state';
import { deleteTopic } from '@actions';
import { logErrorMessage, logEvent } from '@services/logger';

const Topic = ({ topic: topicObj, deleteTopic }) => {
  if (!topicObj) {
    logErrorMessage('missing topic in Topic');
  }

  const { uid, topic } = topicObj;

  const handleDeleteTopic = () => {
    deleteTopic(uid);

    logEvent('add_topic', 'delete_topic');
  };

  return (
    <div class="topic flex justify--between align-items--center">
      <span>{topic}</span>
      <div onClick={handleDeleteTopic}>
        <IconDelete color="secondary" />
      </div>
    </div>
  );
};

const withDeleteTopicAction = withAction(deleteTopic, 'deleteTopic');

export { Topic };
export default withDeleteTopicAction(Topic);
