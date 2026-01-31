package tree_sitter_sindarin_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-sindarin"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_sindarin.Language())
	if language == nil {
		t.Errorf("Error loading Sindarin grammar")
	}
}
