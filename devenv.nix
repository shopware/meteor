{ pkgs, lib, ... }:

{
  packages = with pkgs; [
    nodePackages.pnpm
  ];

  languages.javascript = {
    enable = lib.mkDefault true;
    package = lib.mkDefault pkgs.nodejs-18_x;
  };
}
