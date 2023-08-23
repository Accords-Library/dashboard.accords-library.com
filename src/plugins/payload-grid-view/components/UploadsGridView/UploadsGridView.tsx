import { useWindowInfo } from "@faceless-ui/window-info";
import Button from "payload/dist/admin/components/elements/Button";
import DeleteMany from "payload/dist/admin/components/elements/DeleteMany";
import EditMany from "payload/dist/admin/components/elements/EditMany";
import Eyebrow from "payload/dist/admin/components/elements/Eyebrow";
import { Gutter } from "payload/dist/admin/components/elements/Gutter";
import ListSelection from "payload/dist/admin/components/elements/ListSelection";
import Paginator from "payload/dist/admin/components/elements/Paginator";
import PerPage from "payload/dist/admin/components/elements/PerPage";
import Pill from "payload/dist/admin/components/elements/Pill";
import PublishMany from "payload/dist/admin/components/elements/PublishMany";
import { StaggeredShimmers } from "payload/dist/admin/components/elements/ShimmerEffect";
import { Table } from "payload/dist/admin/components/elements/Table";
import UnpublishMany from "payload/dist/admin/components/elements/UnpublishMany";
import ViewDescription from "payload/dist/admin/components/elements/ViewDescription";
import Meta from "payload/dist/admin/components/utilities/Meta";
import { RelationshipProvider } from "payload/dist/admin/components/views/collections/List/RelationshipProvider";
import { SelectionProvider } from "payload/dist/admin/components/views/collections/List/SelectionProvider";
import { Props } from "payload/dist/admin/components/views/collections/List/types";
import formatFilesize from "payload/dist/uploads/formatFilesize";
import { getTranslation } from "payload/dist/utilities/getTranslation";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid from "./Grid";
import ListControls, { ViewMode } from "./ListControls";

const baseClass = "collection-list";

export type UploadsGridViewOptions = {
  list?: boolean;
  grid?: boolean;
};

export const UploadsGridView =
  (options: UploadsGridViewOptions) =>
  (props: Props): JSX.Element => {
    const {
      collection,
      collection: {
        labels: { singular: singularLabel, plural: pluralLabel },
        admin: {
          description,
          components: { BeforeList, BeforeListTable, AfterListTable, AfterList } = {},
        } = {},
      },
      data,
      newDocumentURL,
      limit,
      hasCreatePermission,
      disableEyebrow,
      modifySearchParams,
      handleSortChange,
      handleWhereChange,
      handlePageChange,
      handlePerPageChange,
      customHeader,
      resetParams,
    } = props;

    const [viewMode, setViewMode] = useState<ViewMode>(options.grid === true ? "grid" : "list");

    const {
      breakpoints: { s: smallBreak },
    } = useWindowInfo();
    const { t, i18n } = useTranslation("general");
    let formattedDocs = data.docs || [];

    if (collection.upload) {
      formattedDocs = formattedDocs?.map((doc) => {
        return {
          ...doc,
          filesize: formatFilesize(doc.filesize),
        };
      });
    }

    return (
      <div className={baseClass}>
        {Array.isArray(BeforeList) &&
          BeforeList.map((Component, i) => <Component key={i} {...props} />)}

        <Meta title={getTranslation(collection.labels.plural, i18n)} />
        <SelectionProvider docs={data.docs} totalDocs={data.totalDocs}>
          {!disableEyebrow && <Eyebrow />}
          <Gutter className={`${baseClass}__wrap`}>
            <header className={`${baseClass}__header`}>
              {customHeader && customHeader}
              {!customHeader && (
                <Fragment>
                  <h1>{getTranslation(pluralLabel, i18n)}</h1>
                  {hasCreatePermission && (
                    <Pill
                      to={newDocumentURL}
                      aria-label={t("createNewLabel", {
                        label: getTranslation(singularLabel, i18n),
                      })}>
                      {t("createNew")}
                    </Pill>
                  )}
                  {!smallBreak && (
                    <ListSelection label={getTranslation(collection.labels.plural, i18n)} />
                  )}
                  {description && (
                    <div className={`${baseClass}__sub-header`}>
                      <ViewDescription description={description} />
                    </div>
                  )}
                </Fragment>
              )}
            </header>
            <ListControls
              collection={collection}
              modifySearchQuery={modifySearchParams}
              handleSortChange={handleSortChange}
              handleWhereChange={handleWhereChange}
              handleViewModeChange={(newViewMode) => setViewMode(newViewMode)}
              resetParams={resetParams}
              viewMode={viewMode}
              showViewModeToggle={options.list === true && options.grid === true}
            />
            {Array.isArray(BeforeListTable) &&
              BeforeListTable.map((Component, i) => <Component key={i} {...props} />)}
            {!data.docs && (
              <StaggeredShimmers
                className={[`${baseClass}__shimmer`, `${baseClass}__shimmer--rows`].join(" ")}
                count={6}
              />
            )}
            {data.docs && data.docs.length > 0 && (
              <RelationshipProvider>
                {viewMode === "grid" ? (
                  <Grid data={formattedDocs} collection={collection} />
                ) : (
                  <Table data={formattedDocs} />
                )}
              </RelationshipProvider>
            )}
            {data.docs && data.docs.length === 0 && (
              <div className={`${baseClass}__no-results`}>
                <p>{t("noResults", { label: getTranslation(pluralLabel, i18n) })}</p>
                {hasCreatePermission && newDocumentURL && (
                  <Button el="link" to={newDocumentURL}>
                    {t("createNewLabel", { label: getTranslation(singularLabel, i18n) })}
                  </Button>
                )}
              </div>
            )}
            {Array.isArray(AfterListTable) &&
              AfterListTable.map((Component, i) => <Component key={i} {...props} />)}

            <div className={`${baseClass}__page-controls`}>
              <Paginator
                limit={data.limit}
                totalPages={data.totalPages}
                page={data.page}
                hasPrevPage={data.hasPrevPage}
                hasNextPage={data.hasNextPage}
                prevPage={data.prevPage ?? undefined}
                nextPage={data.nextPage ?? undefined}
                numberOfNeighbors={1}
                disableHistoryChange={modifySearchParams === false}
                onChange={handlePageChange}
              />
              {data?.totalDocs > 0 && (
                <Fragment>
                  <div className={`${baseClass}__page-info`}>
                    {data.page ?? 1 * data.limit - (data.limit - 1)}-
                    {data.totalPages > 1 && data.totalPages !== data.page
                      ? data.limit * (data.page ?? 1)
                      : data.totalDocs}{" "}
                    {t("of")} {data.totalDocs}
                  </div>
                  <PerPage
                    limits={collection?.admin?.pagination?.limits}
                    limit={limit}
                    modifySearchParams={modifySearchParams}
                    handleChange={handlePerPageChange}
                    resetPage={data.totalDocs <= data.pagingCounter}
                  />
                  <div className={`${baseClass}__list-selection`}>
                    {smallBreak && (
                      <Fragment>
                        <ListSelection label={getTranslation(collection.labels.plural, i18n)} />
                        <div className={`${baseClass}__list-selection-actions`}>
                          <EditMany collection={collection} resetParams={resetParams} />
                          <PublishMany collection={collection} resetParams={resetParams} />
                          <UnpublishMany collection={collection} resetParams={resetParams} />
                          <DeleteMany collection={collection} resetParams={resetParams} />
                        </div>
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          </Gutter>
        </SelectionProvider>
        {Array.isArray(AfterList) &&
          AfterList.map((Component, i) => <Component key={i} {...props} />)}
      </div>
    );
  };
