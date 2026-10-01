import { useTranslations } from 'next-intl';

import { profile } from '@/content/items';

import styles from './Legal.module.css';

/** The postal address as the legal pages print it: one `<address>` block. */
export function Address() {
  const t = useTranslations('legal');
  const { street, postalCode, city } = profile.address;
  return (
    <address className={styles.address}>
      {profile.name}
      <br />
      {street}
      <br />
      {postalCode} {city}
      <br />
      {t('country')}
    </address>
  );
}
