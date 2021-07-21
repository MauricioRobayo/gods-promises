import { useRouter } from "next/router";
import styled from "styled-components";

const Select = styled.select`
  border: none;
  padding: 0.25em;
  background-color: ${({ theme }) => theme.color.surface2};
  color: ${({ theme }) => theme.color.text1};
  border-radius: 4px;
`;

type LanguageSelectorProps = {
  className?: string;
};
export default function LanguageSelector({
  className = "",
}: LanguageSelectorProps) {
  const { push, asPath, locale: currentLocale, locales } = useRouter();

  if (!locales) {
    return null;
  }
  const onSelectChange = (e) => {
    const locale = e.target.value;
    push(asPath, asPath, {
      locale,
      scroll: false,
    });
  };

  return (
    <Select
      className={className}
      value={currentLocale}
      onChange={onSelectChange}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </Select>
  );
}
