import React from "react";
import { styled } from "styled-components";
import { Link } from "react-router-dom";

type Props = {
  route: string;
  filters: { label: string; filter: string }[];
};

export const QuickFilters = ({ route, filters }: Props) => {
  return (
    <Container>
      <div>Quick Filters:</div>
      <FilterContainer>
        <FilterCell label="None" to={route} />
        {filters.map(({ label, filter }, index) => (
          <FilterCell key={index} label={label} to={`${route}?${filter}`} />
        ))}
      </FilterContainer>
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

const Container = styled.div`
  display: flex;
  place-items: center;
  gap: 1rem;
  margin-top: -1rem;
  margin-bottom: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  place-items: center;
  gap: 0.5rem;
`;
