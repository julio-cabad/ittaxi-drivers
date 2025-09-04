import { AppTextProps } from '../AppText/AppText.types';

export interface TextLinkProps extends AppTextProps {
  onPress: () => void;
}
