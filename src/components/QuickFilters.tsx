import { Options } from "payload/dist/collections/operations/local/find";
import QueryString from "qs";
import React from "react";
import { Link } from "react-router-dom";
import { LanguageCodes } from "src/shared/payload/constants";
import styled from "styled-components";

type Props = {
  slug: string;
  filterGroups: { label: string; filter: Omit<Options<any>, "collection"> }[][];
};

export const QuickFilters = ({ slug, filterGroups }: Props) => {
  const route = `/admin/collections/${slug}`;
  return (
    <Container>
      <div>Quick Filters:</div>
      <GroupContainer>
        {filterGroups.map((filtersGroup, groupIndex) => (
          <FilterContainer key={groupIndex}>
            <FilterCell label="None" to={route} />
            {filtersGroup.map(({ label, filter }, index) => (
              <FilterCell
                key={index}
                label={label}
                to={`${route}?${QueryString.stringify(filter)}`}
              />
            ))}
          </FilterContainer>
        ))}
      </GroupContainer>
    </Container>
  );
};

type FilterProps = {
  label: string;
  to: string;
};

const FilterCell = ({ label, to }: FilterProps) => (
  <Link className="pill pill--has-action" to={to}>
    {label}
  </Link>
);

const GroupContainer = styled.div`
  display: grid;
  gap: 4px;
`;

const Container = styled.div`
  display: flex;
  place-items: center;
  gap: 1rem;
  margin-top: -1rem;
  margin-bottom: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  place-items: center;
  gap: 0.5rem;
`;

export const languageBasedFilters = (field: string): Props["filterGroups"][number] =>
  Object.entries(LanguageCodes).map(([key, value]) => ({
    label: `∅ ${value}`,
    filter: { where: { [field]: { not_equals: key } } },
  }));

export const publishStatusFilters: Props["filterGroups"][number] = [
  { label: "Draft", filter: { where: { _status: { equals: "draft" } } } },
  { label: "Published", filter: { where: { _status: { equals: "published" } } } },
];
