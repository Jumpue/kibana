/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EuiIcon } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import {
  Action,
  actionRegistry,
  Embeddable,
  CONTEXT_MENU_TRIGGER,
  triggerRegistry,
  ViewMode,
  PanelActionAPI,
} from 'plugins/embeddable_api/index';
import React from 'react';
import { DASHBOARD_CONTAINER_TYPE, DashboardContainer } from '../embeddable';

export const EXPAND_PANEL_ACTION = 'EXPAND_PANEL_ACTION';

export class ExpandPanelAction extends Action {
  constructor() {
    super({
      type: 'EXPAND_PANEL_ACTION',
    });

    this.title = 'Expand panel';
    this.id = EXPAND_PANEL_ACTION;
    this.priority = 7;
  }

  public isSingleton() {
    return true;
  }

  public allowEditing() {
    return false;
  }

  public allowDynamicTriggerMapping() {
    return false;
  }

  public getTitle({ embeddable, container }: PanelActionAPI<Embeddable, DashboardContainer>) {
    return container.getInput().expandedPanelId
      ? i18n.translate('kbn.embeddable.actions.toggleExpandPanel.expandedDisplayName', {
          defaultMessage: 'Minimize',
        })
      : i18n.translate('kbn.embeddable.actions.toggleExpandPanel.notExpandedDisplayName', {
          defaultMessage: 'Full screen',
        });
  }

  public getIcon({
    embeddable,
    container,
  }: {
    embeddable: Embeddable;
    container: DashboardContainer;
  }) {
    const isExpanded = container.getInput().expandedPanelId === embeddable.id;
    return <EuiIcon type={isExpanded ? 'expand' : 'expand'} />;
  }

  public isCompatible({
    embeddable,
    container,
  }: {
    embeddable: Embeddable;
    container: DashboardContainer;
  }) {
    return Promise.resolve(
      container &&
        container.type === DASHBOARD_CONTAINER_TYPE &&
        embeddable &&
        embeddable.getInput().viewMode === ViewMode.VIEW
    );
  }

  public execute({
    embeddable,
    container,
  }: {
    embeddable: Embeddable;
    container: DashboardContainer;
  }) {
    container.onToggleExpandPanel(embeddable.id);
  }
}

actionRegistry.addAction(new ExpandPanelAction());

triggerRegistry.attachAction({
  triggerId: CONTEXT_MENU_TRIGGER,
  actionId: EXPAND_PANEL_ACTION,
});

triggerRegistry.attachAction({
  triggerId: CONTEXT_MENU_TRIGGER,
  actionId: EXPAND_PANEL_ACTION,
});