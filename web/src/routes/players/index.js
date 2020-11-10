import { withPageView } from '@services/logger';
import withRequireGame from 'components/shared/require_game';

import Players from 'components/players';

export default withPageView(withRequireGame(Players));
