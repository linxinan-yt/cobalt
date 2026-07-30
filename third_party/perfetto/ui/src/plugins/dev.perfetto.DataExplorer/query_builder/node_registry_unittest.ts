// Copyright (C) 2025 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
import {
  NodeRegistry,
  type NodeDescriptor,
  type PreCreateContext,
  type PreCreateState,
} from './node_registry';
import {type QueryNode, NodeType} from '../query_node';
=======
import {NodeRegistry, NodeDescriptor, PreCreateContext} from './node_registry';
import {QueryNode, NodeType, QueryNodeState} from '../query_node';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts

describe('NodeRegistry', () => {
  function createMockNode(nodeId: string): QueryNode {
    return {
      nodeId,
      type: NodeType.kTable,
      nextNodes: [],
      finalCols: [],
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
      attrs: {},
      context: {},
      validate: () => true,
      getTitle: () => 'Test',
      nodeSpecificModify: () => null,
      nodeDetails: () => ({content: null}),
      nodeInfo: () => null,
      clone: () => createMockNode(nodeId),
      getStructuredQuery: () => undefined,
    } as QueryNode;
  }

  // Default required fields for test descriptors (nodeType, deserialize).
  const defaults = {
    nodeType: NodeType.kTable,
    deserialize: () => createMockNode('mock'),
  };

=======
      state: {},
      validate: () => true,
      getTitle: () => 'Test',
      nodeSpecificModify: () => null,
      clone: () => createMockNode(nodeId),
      getStructuredQuery: () => undefined,
      serializeState: () => ({}),
    } as QueryNode;
  }

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
  describe('register', () => {
    it('should register a node descriptor', () => {
      const registry = new NodeRegistry();
      const descriptor: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Test Node',
        description: 'A test node',
        icon: 'test-icon',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('test'),
=======
        factory: (_state: QueryNodeState) => createMockNode('test'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('test-node', descriptor);

      const retrieved = registry.get('test-node');
      expect(retrieved).toBe(descriptor);
    });

    it('should allow registering multiple nodes', () => {
      const registry = new NodeRegistry();
      const descriptor1: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1',
        description: 'First node',
        icon: 'icon1',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
        ...defaults,
=======
        factory: (_state: QueryNodeState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 2',
        description: 'Second node',
        icon: 'icon2',
        type: 'modification',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node2'),
=======
        factory: (_state: QueryNodeState) => createMockNode('node2'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('node1', descriptor1);
      registry.register('node2', descriptor2);

      expect(registry.get('node1')).toBe(descriptor1);
      expect(registry.get('node2')).toBe(descriptor2);
    });

    it('should overwrite existing registration with same id', () => {
      const registry = new NodeRegistry();
      const descriptor1: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1',
        description: 'First node',
        icon: 'icon1',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
        ...defaults,
=======
        factory: (_state: QueryNodeState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1 Updated',
        description: 'Updated node',
        icon: 'icon1-updated',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1-updated'),
=======
        factory: (_state: QueryNodeState) => createMockNode('node1-updated'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('node1', descriptor1);
      registry.register('node1', descriptor2);

      const retrieved = registry.get('node1');
      expect(retrieved).toBe(descriptor2);
      expect(retrieved?.name).toBe('Node 1 Updated');
    });

    it('should register node with optional fields', () => {
      const registry = new NodeRegistry();
      const preCreate = async (_context: PreCreateContext) => ({});
      const descriptor: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Advanced Node',
        description: 'Node with optional fields',
        icon: 'advanced-icon',
        type: 'multisource',
        hotkey: 'ctrl+a',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        preCreate,
        factory: (_state: PreCreateState) => createMockNode('advanced'),
=======
        devOnly: true,
        preCreate,
        factory: (_state: QueryNodeState) => createMockNode('advanced'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('advanced-node', descriptor);

      const retrieved = registry.get('advanced-node');
      expect(retrieved?.hotkey).toBe('ctrl+a');
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
=======
      expect(retrieved?.devOnly).toBe(true);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      expect(retrieved?.preCreate).toBe(preCreate);
    });
  });

  describe('get', () => {
    it('should return undefined for non-existent id', () => {
      const registry = new NodeRegistry();

      const result = registry.get('non-existent');

      expect(result).toBeUndefined();
    });

    it('should return registered descriptor', () => {
      const registry = new NodeRegistry();
      const descriptor: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Test Node',
        description: 'A test node',
        icon: 'test-icon',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('test'),
=======
        factory: (_state: QueryNodeState) => createMockNode('test'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('test-node', descriptor);

      const result = registry.get('test-node');
      expect(result).toBe(descriptor);
      expect(result?.name).toBe('Test Node');
    });

    it('should handle special characters in id', () => {
      const registry = new NodeRegistry();
      const descriptor: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Special Node',
        description: 'Node with special id',
        icon: 'special-icon',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('special'),
=======
        factory: (_state: QueryNodeState) => createMockNode('special'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('node:with:special-chars_123', descriptor);

      const result = registry.get('node:with:special-chars_123');
      expect(result).toBe(descriptor);
    });
  });

  describe('list', () => {
    it('should return empty array for empty registry', () => {
      const registry = new NodeRegistry();

      const result = registry.list();

      expect(result).toEqual([]);
    });

    it('should return all registered nodes', () => {
      const registry = new NodeRegistry();
      const descriptor1: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1',
        description: 'First node',
        icon: 'icon1',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
        ...defaults,
=======
        factory: (_state: QueryNodeState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 2',
        description: 'Second node',
        icon: 'icon2',
        type: 'modification',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node2'),
      };
      const descriptor3: NodeDescriptor = {
        ...defaults,
=======
        factory: (_state: QueryNodeState) => createMockNode('node2'),
      };
      const descriptor3: NodeDescriptor = {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 3',
        description: 'Third node',
        icon: 'icon3',
        type: 'multisource',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node3'),
=======
        factory: (_state: QueryNodeState) => createMockNode('node3'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('node1', descriptor1);
      registry.register('node2', descriptor2);
      registry.register('node3', descriptor3);

      const result = registry.list();

      expect(result.length).toBe(3);
      expect(result).toContainEqual(['node1', descriptor1]);
      expect(result).toContainEqual(['node2', descriptor2]);
      expect(result).toContainEqual(['node3', descriptor3]);
    });

    it('should return tuples of [id, descriptor]', () => {
      const registry = new NodeRegistry();
      const descriptor: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Test Node',
        description: 'A test node',
        icon: 'test-icon',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('test'),
=======
        factory: (_state: QueryNodeState) => createMockNode('test'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('test-node', descriptor);

      const result = registry.list();

      expect(result.length).toBe(1);
      expect(result[0][0]).toBe('test-node');
      expect(result[0][1]).toBe(descriptor);
    });

    it('should reflect updates when node is re-registered', () => {
      const registry = new NodeRegistry();
      const descriptor1: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1',
        description: 'First node',
        icon: 'icon1',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
        ...defaults,
=======
        factory: (_state: QueryNodeState) => createMockNode('node1'),
      };
      const descriptor2: NodeDescriptor = {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Node 1 Updated',
        description: 'Updated node',
        icon: 'icon1-updated',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('node1-updated'),
=======
        factory: (_state: QueryNodeState) => createMockNode('node1-updated'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };

      registry.register('node1', descriptor1);
      let result = registry.list();
      expect(result.length).toBe(1);
      expect(result[0][1].name).toBe('Node 1');

      registry.register('node1', descriptor2);
      result = registry.list();
      expect(result.length).toBe(1);
      expect(result[0][1].name).toBe('Node 1 Updated');
    });
  });

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
  describe('getAllowedChildrenFor', () => {
    it('should return default allowed children when node has no override', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });
      registry.setDefaultAllowedChildren(['filter']);

      const result = registry.getAllowedChildrenFor(NodeType.kTable);

      expect(result).toEqual(['filter']);
    });

    it('should return per-node override when set', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: ['filter'],
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });
      registry.setDefaultAllowedChildren(['filter', 'sort']);

      const result = registry.getAllowedChildrenFor(NodeType.kTable);

      expect(result).toEqual(['filter']);
    });

    it('should return empty array when override is empty', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: [],
        factory: () => createMockNode('s'),
      });
      registry.setDefaultAllowedChildren(['filter']);

      const result = registry.getAllowedChildrenFor(NodeType.kTable);

      expect(result).toEqual([]);
    });
  });

  describe('isConnectionAllowed', () => {
    it('should allow connection when child type is in allowed list', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });
      registry.setDefaultAllowedChildren(['filter']);

      expect(
        registry.isConnectionAllowed(NodeType.kTable, NodeType.kFilter),
      ).toBe(true);
    });

    it('should block connection when child type is not in allowed list', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: ['filter'],
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });
      registry.register('sort', {
        ...defaults,
        nodeType: NodeType.kSort,
        name: 'Sort',
        description: 'A sort',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('so'),
      });

      expect(
        registry.isConnectionAllowed(NodeType.kTable, NodeType.kSort),
      ).toBe(false);
    });

    it('should block all connections when allowed children is empty', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: [],
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });

      expect(
        registry.isConnectionAllowed(NodeType.kTable, NodeType.kFilter),
      ).toBe(false);
    });

    it('should block connection for unregistered child type', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        factory: () => createMockNode('s'),
      });
      registry.setDefaultAllowedChildren(['filter']);

      // kFilter is not registered, only listed as allowed
      expect(
        registry.isConnectionAllowed(NodeType.kTable, NodeType.kFilter),
      ).toBe(false);
    });
  });

  describe('validateAllowedChildren', () => {
    it('should pass when all references are valid', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: ['filter'],
        factory: () => createMockNode('s'),
      });
      registry.register('filter', {
        ...defaults,
        nodeType: NodeType.kFilter,
        name: 'Filter',
        description: 'A filter',
        icon: 'icon',
        type: 'modification',
        factory: () => createMockNode('f'),
      });
      registry.setDefaultAllowedChildren(['filter']);

      expect(() => registry.validateAllowedChildren()).not.toThrow();
    });

    it('should throw when per-node allowedChildren references unregistered ID', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        allowedChildren: ['nonexistent_node'],
        factory: () => createMockNode('s'),
      });

      expect(() => registry.validateAllowedChildren()).toThrow(
        /Node 'source' allowedChildren references unregistered node ID: 'nonexistent_node'/,
      );
    });

    it('should throw when default allowedChildren references unregistered ID', () => {
      const registry = new NodeRegistry();
      registry.register('source', {
        ...defaults,
        nodeType: NodeType.kTable,
        name: 'Source',
        description: 'A source',
        icon: 'icon',
        type: 'source',
        factory: () => createMockNode('s'),
      });
      registry.setDefaultAllowedChildren(['ghost_node']);

      expect(() => registry.validateAllowedChildren()).toThrow(
        /Default allowedChildren references unregistered node ID: 'ghost_node'/,
      );
    });
  });

=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
  describe('integration tests', () => {
    it('should handle full lifecycle of node registration', () => {
      const registry = new NodeRegistry();

      // Start empty
      expect(registry.list().length).toBe(0);

      // Register first node
      const descriptor1: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Source Node',
        description: 'A source node',
        icon: 'source-icon',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('source'),
=======
        factory: (_state: QueryNodeState) => createMockNode('source'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };
      registry.register('source-node', descriptor1);
      expect(registry.list().length).toBe(1);
      expect(registry.get('source-node')).toBe(descriptor1);

      // Register second node
      const descriptor2: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Modify Node',
        description: 'A modification node',
        icon: 'modify-icon',
        type: 'modification',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('modify'),
=======
        factory: (_state: QueryNodeState) => createMockNode('modify'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };
      registry.register('modify-node', descriptor2);
      expect(registry.list().length).toBe(2);
      expect(registry.get('modify-node')).toBe(descriptor2);

      // Update first node
      const descriptor1Updated: NodeDescriptor = {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        ...defaults,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
        name: 'Source Node Updated',
        description: 'Updated source node',
        icon: 'source-icon-updated',
        type: 'source',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/node_registry_unittest.ts
        factory: (_state: PreCreateState) => createMockNode('source-updated'),
=======
        factory: (_state: QueryNodeState) => createMockNode('source-updated'),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/node_registry_unittest.ts
      };
      registry.register('source-node', descriptor1Updated);
      expect(registry.list().length).toBe(2);
      expect(registry.get('source-node')).toBe(descriptor1Updated);
    });
  });
});
