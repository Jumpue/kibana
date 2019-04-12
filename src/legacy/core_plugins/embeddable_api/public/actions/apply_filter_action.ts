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

import { Container, ContainerInput, ContainerOutput } from '../containers';
import { EmbeddableInput, Embeddable, EmbeddableOutput } from '../embeddables';
import { APPLY_FILTER_TRIGGER, triggerRegistry } from '../triggers';
import { Filter } from '../types';
import { Action, ExecuteActionContext } from './action';
import { actionRegistry } from './action_registry';

interface ApplyFilterContainerInput extends ContainerInput {
  filters: Filter[];
}

const APPLY_FILTER_ACTION_ID = 'APPLY_FILTER_ACTION_ID';

export class ApplyFilterAction extends Action<
  Embeddable,
  Container<EmbeddableInput, EmbeddableOutput, ApplyFilterContainerInput>,
  { filters: Filter[] }
> {
  constructor() {
    super(APPLY_FILTER_ACTION_ID);

    this.description =
      'This action uses advanced internal knowledge of our embeddables and our filter shape to apply a filter to a' +
      ' container that comes from the APPLY_FILTER_TRIGGER. Functionally, this should implement the same flow Kibana users are' +
      ' used to when they click on a magnifying glass in a saved search, or a pie slice on a visualization, for example.';
  }

  public getTitle() {
    return 'Apply filter to current view';
  }

  public execute({
    container,
    triggerContext,
  }: {
    container?: Container<EmbeddableInput, EmbeddableOutput, ApplyFilterContainerInput>;
    triggerContext?: { filters: Filter[] };
  }) {
    if (!container) {
      throw new Error('Apply filter action requires a container');
    }

    if (!triggerContext) {
      throw new Error('Applying a filter requires a filter as context');
    }

    const newState = _.cloneDeep(container.getInput()) as ApplyFilterContainerInput;
    newState.filters = triggerContext.filters;
    container.updateInput(newState);
  }
}

actionRegistry.addAction(new ApplyFilterAction());

triggerRegistry.attachAction({
  triggerId: APPLY_FILTER_TRIGGER,
  actionId: APPLY_FILTER_ACTION_ID,
});