import {ArrowPathIcon} from '@heroicons/react/24/outline';
import {TagIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';
import {Colors, Tags} from '../../../types/types';
import Box from '../Box/Box';
import Button from '../Button/Button';
import IconButton from '../Button/IconButton';
import Modal from '../Modal/Modal';
import {TooltipPosition} from '../Tooltip/Tooltip';
import {FILTER_OPTIONS} from '../../ActionBar/ActionBar';

const TAG_OPTIONS = FILTER_OPTIONS.filter(({isTag}) => {
  return isTag;
});

import './Tags.less';
import {Option} from '../Dropdown/Dropdown';
import MultiSelect from '../Dropdown/MultiSelect';

type TagsButtonProps = {
  itemTags: Tags[];
  onSubmit: (tagValues: Tags[]) => void;
};

const TagsButton = ({onSubmit, itemTags}: TagsButtonProps): JSX.Element => {
  const itemTagsToOptions = itemTags.sort().map((itemTag) => {
    return TAG_OPTIONS.find(({value}) => itemTag === value);
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<Option[]>(
    itemTagsToOptions as Option[]
  );

  const handleSubmit = () => {
    setIsModalOpen(false);

    const tagValues: Tags[] = selectedTags.map(({value}) => value as Tags);
    onSubmit(tagValues);
  };

  const handleMultiSelectChange = (newlySelectedTags: Option[]) => {
    setSelectedTags(newlySelectedTags);
  };

  const isChanged =
    JSON.stringify(itemTagsToOptions) !== JSON.stringify(selectedTags);

  const renderModal = () => {
    return (
      <Modal title="Add tags" onClose={() => setIsModalOpen(false)}>
        <Box flexDirection="column" gap={30}>
          <Box width="300px" mt={10}>
            <MultiSelect
              value={selectedTags as Option[]}
              options={TAG_OPTIONS}
              placeholder="Select tags"
              onChange={handleMultiSelectChange}
            />
          </Box>
          <Box justifyContent="end" alignItems="center">
            <Button
              onClick={handleSubmit}
              color={Colors.ACTION}
              disabled={!isChanged}>
              <ArrowPathIcon className="button-icon" />
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <IconButton
        tooltip={{
          text: 'Add tags',
          position: TooltipPosition.LEFT,
        }}
        onClick={() => setIsModalOpen(true)}>
        <TagIcon className="button-icon" />
      </IconButton>
      {isModalOpen && renderModal()}
    </>
  );
};

export default TagsButton;
