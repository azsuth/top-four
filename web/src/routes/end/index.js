import { withPageView } from '@services/logger';
import withRequireGame from 'components/shared/require_game';

import End from 'components/end';

export default withPageView(withRequireGame(End));
