import {TagIcon} from '@heroicons/react/24/solid';
import {Tags} from '../../../types/types';
import Box from '../Box/Box';

import './Tags.less';

type TagProps = {
  children: Tags;
};

const Tag = ({children}: TagProps) => {
  return (
    <Box className="tag" gap={5}>
      <TagIcon />
      {children}
    </Box>
  );
};

export default Tag;
