import { useWindowInfo } from "@faceless-ui/window-info";
import Button from "payload/dist/admin/components/elements/Button";
import ColumnSelector from "payload/dist/admin/components/elements/ColumnSelector";
import DeleteMany from "payload/dist/admin/components/elements/DeleteMany";
import EditMany from "payload/dist/admin/components/elements/EditMany";
import { getTextFieldsToBeSearched } from "payload/dist/admin/components/elements/ListControls/getTextFieldsToBeSearched";
import { Props } from "payload/dist/admin/components/elements/ListControls/types";
import Pill from "payload/dist/admin/components/elements/Pill";
import PublishMany from "payload/dist/admin/components/elements/PublishMany";
import SearchFilter from "payload/dist/admin/components/elements/SearchFilter";
import SortComplex from "payload/dist/admin/components/elements/SortComplex";
import UnpublishMany from "payload/dist/admin/components/elements/UnpublishMany";
import WhereBuilder from "payload/dist/admin/components/elements/WhereBuilder";
import validateWhereQuery from "payload/dist/admin/components/elements/WhereBuilder/validateWhereQuery";
import Chevron from "payload/dist/admin/components/icons/Chevron";
import { useSearchParams } from "payload/dist/admin/components/utilities/SearchParams";
import { SanitizedCollectionConfig } from "payload/dist/collections/config/types";
import { fieldAffectsData } from "payload/dist/fields/config/types";
import flattenFields from "payload/dist/utilities/flattenTopLevelFields";
import { getTranslation } from "payload/dist/utilities/getTranslation";
import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";

const baseClass = "list-controls";

export type ViewMode = "grid" | "list";

const getUseAsTitle = (collection: SanitizedCollectionConfig) => {
  const {
    admin: { useAsTitle },
    fields,
  } = collection;

  const topLevelFields = flattenFields(fields);
  return topLevelFields.find((field) => fieldAffectsData(field) && field.name === useAsTitle);
};

/**
 * The ListControls component is used to render the controls (search, filter, where)
 * for a collection's list view. You can find those directly above the table which lists
 * the collection's documents.
 */
const ListControls: React.FC<
  Props & {
    viewMode: ViewMode;
    handleViewModeChange: (newMode: ViewMode) => void;
    showViewModeToggle: boolean;
  }
> = (props) => {
  const {
    collection,
    enableColumns = true,
    enableSort = false,
    handleSortChange,
    handleWhereChange,
    modifySearchQuery = true,
    resetParams = () => undefined,
    viewMode,
    handleViewModeChange,
    collection: {
      fields,
      admin: { listSearchableFields },
    },
    showViewModeToggle,
  } = props;

  const params = useSearchParams();
  const shouldInitializeWhereOpened = validateWhereQuery(params?.where);

  const [titleField, setTitleField] = useState(getUseAsTitle(collection));
  useEffect(() => {
    setTitleField(getUseAsTitle(collection));
  }, [collection]);

  const [textFieldsToBeSearched] = useState(
    getTextFieldsToBeSearched(listSearchableFields, fields)
  );
  const [visibleDrawer, setVisibleDrawer] = useState<"where" | "sort" | "columns" | undefined>(
    shouldInitializeWhereOpened ? "where" : undefined
  );
  const { t, i18n } = useTranslation("general");
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo();

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <SearchFilter
          fieldName={titleField && fieldAffectsData(titleField) ? titleField.name : undefined}
          handleChange={handleWhereChange}
          modifySearchQuery={modifySearchQuery}
          fieldLabel={
            titleField && fieldAffectsData(titleField)
              ? getTranslation(String(titleField.label ?? titleField.name), i18n)
              : undefined
          }
          listSearchableFields={textFieldsToBeSearched}
        />
        <div className={`${baseClass}__buttons`}>
          <div className={`${baseClass}__buttons-wrap`}>
            {!smallBreak && (
              <React.Fragment>
                <EditMany collection={collection} resetParams={resetParams} />
                <PublishMany collection={collection} resetParams={resetParams} />
                <UnpublishMany collection={collection} resetParams={resetParams} />
                <DeleteMany collection={collection} resetParams={resetParams} />
              </React.Fragment>
            )}
            {enableColumns && (
              <Pill
                pillStyle="light"
                className={`${baseClass}__toggle-columns ${
                  visibleDrawer === "columns" ? `${baseClass}__buttons-active` : ""
                }`}
                onClick={() =>
                  setVisibleDrawer(visibleDrawer !== "columns" ? "columns" : undefined)
                }
                aria-expanded={visibleDrawer === "columns"}
                aria-controls={`${baseClass}-columns`}
                icon={<Chevron />}>
                {t("columns")}
              </Pill>
            )}

            <Pill
              pillStyle="light"
              className={`${baseClass}__toggle-where ${
                visibleDrawer === "where" ? `${baseClass}__buttons-active` : ""
              }`}
              onClick={() => setVisibleDrawer(visibleDrawer !== "where" ? "where" : undefined)}
              aria-expanded={visibleDrawer === "where"}
              aria-controls={`${baseClass}-where`}
              icon={<Chevron />}>
              {t("filters")}
            </Pill>
            {enableSort && (
              <Button
                className={`${baseClass}__toggle-sort`}
                buttonStyle={visibleDrawer === "sort" ? undefined : "secondary"}
                onClick={() => setVisibleDrawer(visibleDrawer !== "sort" ? "sort" : undefined)}
                aria-expanded={visibleDrawer === "sort"}
                aria-controls={`${baseClass}-sort`}
                icon="chevron"
                iconStyle="none">
                {t("sort")}
              </Button>
            )}
            {showViewModeToggle && (
              <div style={{ marginLeft: 10 }}>
                <svg
                  onClick={() => handleViewModeChange("list")}
                  style={{
                    cursor: "pointer",
                    color:
                      viewMode === "list"
                        ? "var(--theme-elevation-1000)"
                        : "var(--theme-elevation-500)",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  preserveAspectRatio="none"
                  height="32"
                  width="28">
                  <path
                    fill="currentColor"
                    d="M333-242h432.5q12 0 22-10t10-22v-100.5H333V-242ZM162.5-586h145v-132h-113q-12 0-22 10t-10 22v100Zm0 187h145v-161.5h-145V-399Zm32 157h113v-132.5h-145V-274q0 12 10 22t22 10ZM333-399h464.5v-161.5H333V-399Zm0-187h464.5v-100q0-12-10-22t-22-10H333v132ZM194.28-216.5q-24.218 0-40.749-16.531Q137-249.562 137-273.802v-412.396q0-24.24 16.531-40.771Q170.062-743.5 194.28-743.5h571.44q24.218 0 40.749 16.531Q823-710.438 823-686.198v412.396q0 24.24-16.531 40.771Q789.938-216.5 765.72-216.5H194.28Z"
                  />
                </svg>
                <svg
                  onClick={() => handleViewModeChange("grid")}
                  style={{
                    cursor: "pointer",
                    color:
                      viewMode === "grid"
                        ? "var(--theme-elevation-1000)"
                        : "var(--theme-elevation-500)",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  height="28"
                  width="28">
                  <path
                    fill="currentColor"
                    d="M176.5-519v-264.5h265V-519h-265Zm0 342.5v-265h265v265h-265ZM519-519v-264.5h264.5V-519H519Zm0 342.5v-265h264.5v265H519Zm-317-368h214V-758H202v213.5Zm342.5 0H758V-758H544.5v213.5Zm0 342.5H758v-214H544.5v214ZM202-202h214v-214H202v214Zm342.5-342.5Zm0 128.5ZM416-416Zm0-128.5Z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      {enableColumns && (
        <AnimateHeight
          className={`${baseClass}__columns`}
          height={visibleDrawer === "columns" ? "auto" : 0}
          id={`${baseClass}-columns`}>
          <ColumnSelector collection={collection} />
        </AnimateHeight>
      )}
      <AnimateHeight
        className={`${baseClass}__where`}
        height={visibleDrawer === "where" ? "auto" : 0}
        id={`${baseClass}-where`}>
        <WhereBuilder
          collection={collection}
          modifySearchQuery={modifySearchQuery}
          handleChange={handleWhereChange}
        />
      </AnimateHeight>
      {enableSort && (
        <AnimateHeight
          className={`${baseClass}__sort`}
          height={visibleDrawer === "sort" ? "auto" : 0}
          id={`${baseClass}-sort`}>
          <SortComplex
            modifySearchQuery={modifySearchQuery}
            collection={collection}
            handleChange={handleSortChange}
          />
        </AnimateHeight>
      )}
    </div>
  );
};

export default ListControls;
