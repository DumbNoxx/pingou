{
  description = "Pingou bot";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        nativeBuildInputs = [
          pkgs.bun
          pkgs.typescript-language-server
          pkgs.typescript
          pkgs.husky
        ];
        buildInputs = with pkgs; [ ];
      in
      {
        devShells.default = pkgs.mkShell { inherit nativeBuildInputs buildInputs; };

      }
    );
}
