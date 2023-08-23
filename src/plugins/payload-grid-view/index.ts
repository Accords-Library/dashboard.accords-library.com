import { Plugin } from "payload/config";
import { CollectionAdminOptions } from "payload/dist/collections/config/types";
import { CollectionConfig } from "payload/types";
import { UploadsGridView, UploadsGridViewOptions } from "./components/UploadsGridView/UploadsGridView";

type Components = Required<CollectionAdminOptions>["components"];
type ViewsComponents = Required<Required<CollectionAdminOptions>["components"]>["views"];

type Options = {
  isUploadEnabled: boolean;
  gridView: UploadsGridViewOptions;
};

export type CollectionConfigWithGridView = CollectionConfig & {
  custom?: { gridView?: UploadsGridViewOptions };
};

export const gridViewPlugin: Plugin = ({ collections, ...others }) => ({
  collections: collections?.map(handleCollection),
  ...others,
});

const handleCollection = ({
  admin,
  ...others
}: CollectionConfigWithGridView): CollectionConfig => ({
  ...others,
  admin: handleAdmin(admin, {
    isUploadEnabled: others.upload !== undefined,
    gridView: others.custom?.gridView ?? { grid: true, list: true },
  }),
});

const handleAdmin = (
  { components, ...others }: CollectionAdminOptions = {},
  options: Options
): CollectionAdminOptions => ({
  ...others,
  components: handleComponents(components, options),
});

const handleComponents = ({ views, ...others }: Components = {}, options: Options): Components => ({
  ...others,
  views: handleViewsComponents(views, options),
});

const handleViewsComponents = (
  { List, ...others }: ViewsComponents = {},
  { isUploadEnabled, gridView }: Options
): ViewsComponents => ({
  ...others,
  List: isUploadEnabled ? UploadsGridView(gridView) : List,
});
