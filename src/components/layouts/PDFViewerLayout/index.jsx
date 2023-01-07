import { PDFViewerPage } from '@site/src/pages/_pdf-viewer/index';
import NotFound from '@theme/NotFound';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

function PDFViewerLayout() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path} exact>
        <PDFViewerPage />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default PDFViewerLayout;
