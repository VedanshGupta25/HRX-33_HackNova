nix
{ pkgs }:

{
  devShells.default = pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      nodePackages.npm
    ];

    shellHook = ''
      echo "Starting development environment..."
      export NIX_SHELL=1
    '';

    # Add a preview configuration
    # Replace with your actual preview command
    preview = {
      command = "npm run dev";
      ports = [ 5173 ]; # Replace with the port your development server runs on
      autoStart = true; # Set to true to automatically start the preview on shell entry
    };
  };
}